<template>
    <section class="px-4 tablet:px-6">
        <button @click="console.log('abc')">ABC</button>
      <!-- {% if term != '' %}
        {% if posts|length > 0 %}
          {% block list_sidebar %}
          {% endblock %}
          <div class="tablet:px-6">
            {% block before_list %}
            <h2 class="text-p font-p inline-block my-4">
              {% if posts|length > 1 %}
                {{ __('Showing {{ TOTAL_VISIBLE }} results for "{{ TERM }}".', 'WNYC')|replace({'{{ TOTAL_VISIBLE }}': posts|length, '{{ TERM }}': term}) }}
              {% else %}
                {{ __('Showing 1 result for "{{ TERM }}".', 'WNYC')|replace({'{{ TERM }}': term}) }}
              {% endif %}
            </h2>
            <div>
              <button class="btn-tag btn-primary" id='all-button'>{{__('All', 'WNYC')}}</button>
              <button class="btn-tag" id='jobs-button'>{{__('Jobs', 'WNYC')}}</button>
              <button class="btn-tag" id='programs-button'>{{__('Programs', 'WNYC')}}</button>
            </div>
            {% endblock %}
            <div class="grid gap-3 desktop:grid-cols-2 mb-3">
              {% block post_list %}
                {% for post in posts %}
                  {% if post.post_type == 'jobs' %}
                    <div data-js="search-result" data-js-result-type="job">
                      {% include 'jobs/job.twig' with {
                        this: {
                          post: post
                        }
                      } %}
                    </div>
                  {% elseif post.post_type == 'programs' %}
                    <div data-js="search-result" data-js-result-type="program">
                      {% include 'programs/program.twig' with {
                        this: {
                          post: post
                        }
                      } %}
                    </div>
                  {% endif %}
                {% endfor %}
              {% endblock %}
            </div>
            {% block after_list %}
            {% endblock %}
          </div> 
        {% else %}
        <div class="my-3 tablet:my-4 tablet:px-6">
          <h4>{{__('No results for "{{ TERM }}"', 'WNYC')|replace({'{{ TERM }}': term})}}</h4>
          <h5 style="margin-top: var(--nyco-typography-margin-bottom);">{{__('Search help', 'WNYC')}}</h5>
          <list>
            <li class="m-0">{{__('Check your search for typos', 'WNYC')}}</li>
            <li class="m-0">{{__('Use generic search terms', 'WNYC')}}</li>
            <li class="m-0">{{__('Browse our <a href="{{ PROGRAMS_URL }}">programs</a> and <a href="{{ JOBS_URL }}">jobs</a>', 'WNYC')|replace({'{{ PROGRAMS_URL }}': site.url|last == '/' ? site.url ~ 'programs' : site.url ~ '/programs', '{{ JOBS_URL }}': site.url|last == '/' ? site.url ~ 'jobs' : site.url ~ '/jobs'})}}</li>
          </list>
          <h5 style="margin-top: var(--nyco-typography-margin-bottom);">{{__('If you still can\'t find what you\'re looking for, {{ FEEDBACK }} to improve our site.', 'WNYC')|replace({'{{ FEEDBACK }}': '<a href="https://airtable.com/shrfQGpXvo9mmmHpJ">send us feedback</a>'})}}</h5>
        </div>
        {% endif %}
      {% endif %} -->
    </section> 
</template>

<script>
  import SearchArchive from '../../src/js/modules/search-archive.js';

  export default SearchArchive;
</script>